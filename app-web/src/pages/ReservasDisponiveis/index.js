import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../repository/supabase';
import { useData } from '../../DataContext'; // Importe useData

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function ReservasDisponiveis({ route, navigation }) {
  const { username } = useData(); // Use o hook useData para acessar o username
  
  const [info, setInfo] = useState([]);
  const [info2, setInfo2] = useState([]);
  const [info3, setInfo3] = useState([]);
  const [info4, setInfo4] = useState();
  const [isDataRendered, setIsDataRendered] = useState(false);

  function removerElemento(array, elemento) {
    return array.map(item => {
      if (Array.isArray(item)) {
        return removerElemento(item, elemento);
      } else {
        return item === elemento ? undefined : item;
      }
    }).filter(item => item !== undefined);
  }

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("TB_DOACOES")
      .select('*')
      .eq('status', 'Pendente');

    setInfo(data);

    let usuario = await supabase
      .from("TB_USUARIOS")
      .select('ID, ENDERECO')
      .eq('USERNAME', username);

    
    delete usuario.count;
    delete usuario.error;
    delete usuario.status;
    delete usuario.statusText;
    let usuario_array = Object.entries(usuario);
    usuario_array = removerElemento(usuario_array, 'data');
    usuario_array = usuario_array.flat(Infinity);
    setInfo4(usuario_array);
    

    let dados2 = await supabase
      .from("TB_USUARIOS")
      .select('ID,NOME,TEL,ENDERECO,NOTA')
      .in('ID', data.map(item => item.user_id));

    delete dados2.count;
    delete dados2.error;
    delete dados2.status;
    delete dados2.statusText;
    setInfo2(dados2);

    let info2_array = Object.entries(dados2);
    let dados_doacao = Object.entries(data);
    let resultado = dados_doacao.map(subarray => subarray[1]);
    let novoArray = removerElemento(info2_array, 'data');
    let arrayPlano = novoArray.flat(Infinity);
    
    resultado.forEach(itemResultado => {
      const itemArrayPlano = arrayPlano.find(item => item.ID === itemResultado.user_id);
      if (itemArrayPlano) {
        Object.assign(itemResultado, itemArrayPlano);
      }
    });

    setInfo3(resultado);
    setIsDataRendered(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reservarDoacao = async (id, descricao, disponivel_ate, ENDERECO, user_id) => {
    
    const { error: updateError } = await supabase
      .from('TB_DOACOES')
      .update({ status: 'Reservada' })
      .eq('id', id);

    if (updateError) {
      console.error('Erro ao reservar doação:', updateError);
    } else {
      const { data: reservaData, error: insertError } = await supabase
        .from('TB_RESERVAS')
        .insert([{
          DOACAO_ID: id,
          USER_ID: info4[0].ID,
          STATUS: 'Reservada',
          descricao: descricao,
          disponivel_ate: disponivel_ate,
          endereco_retirada: ENDERECO,
        },
        ]);
      if (insertError) {
        console.error('Erro ao inserir reserva:', insertError);
      } else {
        console.log('Doação reservada com sucesso!');
        Alert.alert('Doação reservada com sucesso!', '', [
          { text: 'OK', onPress: () => fetchData() }
        ]);
      }
    }
  };

  const Item = ({ id, ENDERECO, NOME, NOTA, TEL, descricao, quantidade_kg, disponivel_ate, id_usuario}) => {
    const [status, setStatus] = useState('Pendente');

    return (
      <View style={{ marginBottom: 25, borderWidth: 2, width: '100%', backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18 }}>{NOME}</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{NOTA}/5</Text>
        </View>
        <Text style={{ fontSize: 18 }}>{ENDERECO}</Text>
        <Text style={{ fontSize: 18 }}>Tel: {TEL}</Text>
        <Text style={{ fontSize: 18 }}>Descrição: {descricao}</Text>
        <Text style={{ fontSize: 18 }}>Quantidade: {quantidade_kg} kg</Text>
        <Text style={{ fontSize: 18 }}>Disponível até: {disponivel_ate}</Text>
        {status === 'Pendente' && (
          <TouchableOpacity onPress={() => reservarDoacao(id, descricao, disponivel_ate, id_usuario, ENDERECO)} style={styles.botaoReserva}>
            <Text style={{ color: 'white' }}>Reservar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" animating={!isDataRendered} />
      <FlatList
        data={info3}
        renderItem={({ item }) => <Item id={item.id} ENDERECO={item.ENDERECO} NOME={item.NOME} NOTA={item.NOTA} TEL={item.TEL} descricao={item.descricao}
          quantidade_kg={item.quantidade_kg} disponivel_ate={item.disponivel_ate} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

export default ReservasDisponiveis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7E1D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoReserva: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});
