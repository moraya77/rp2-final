import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Button, Modal, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../repository/supabase';

const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

function MinhasReservas({ route, navigation }) {
    const { user_id } = route.params;

    const [info, setInfo] = useState([]);
    const [info2, setInfo2] = useState([]);

    const [isDataRendered, setIsDataRendered] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [currentId, setCurrentId] = useState('');

    async function fetchData() {
        setIsDataRendered(false);
        const { data, error } = await supabase
    .from("TB_RESERVAS")
    .select(`
        ID,
        CRIADA_EM,
        STATUS,
        descricao,
        disponivel_ate,
        DOACAO_ID,
        endereco_retirada,
        TB_DOACOES (
            quantidade_kg
        )
    `)
    .eq('USER_ID', user_id)
    .order('STATUS', { ascending: false });

if (error) {
    console.error('Erro na consulta:', error);
} else {
    console.log('Dados recebidos:', data);
}
        
        
        setInfo(data);
        setIsDataRendered(true);
    }

    const reservaColetada = async (ID) => {
        setIsDataRendered(false);
        const { data, error } = await supabase
            .from('TB_RESERVAS')
            .update({ STATUS: 'Coletada' })
            .eq('ID', ID)
            .select()
        
        setModalVisible(!modalVisible);
        setIsDataRendered(true);

        fetchData();
    };

    const onButtonClick = (ID) => {
        setCurrentId(ID);
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const setColor = (STATUS) => {
        if (STATUS === 'Reservada') return 'blue'
        else if (STATUS === 'Coletada') return 'green'
        else return 'red'
    };

    const Item = ({ disponivel_ate, STATUS, descricao, ID, endereco_retirada, TB_DOACOES }) => (
        <View style={{ marginBottom: 20, borderWidth: 2, width: "100%", backgroundColor: 'white' }}>
            <Text style={{ fontSize: 18 }}>{descricao}</Text>
            <Text style={{ fontSize: 18 }}>Disponível até: {disponivel_ate}</Text>
            <Text style={{ fontSize: 18 }}>Retire em: {endereco_retirada}</Text>
            <Text style={{ fontSize: 18 }}>Quantidade: {TB_DOACOES?.quantidade_kg}Kg</Text>
            {STATUS === 'Reservada' &&
                <Button color={"blue"} title="Confirmar retirada" onPress={() => onButtonClick(ID)}/>
            }
            <Text style={{ fontSize: 18, textAlign: 'right', color: setColor(STATUS) }}>{STATUS}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}></Text>
                        <Text style={styles.modalText}>Você deseja confirmar a retirada?</Text>
                        <View style={{ flexDirection: 'row' }}>
                        <Pressable
                            style={styles.button}
                            onPress={() => reservaColetada(currentId)}>
                            <Text style={styles.textStyleYes}>Sim</Text>
                        </Pressable>
                        <Pressable
                            style={styles.button}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Não</Text>
                        </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <ActivityIndicator size="large" animating={!isDataRendered} />
            <FlatList
                data={info}
                renderItem={({ item }) => <Item disponivel_ate={item.disponivel_ate} endereco_retirada={item.endereco_retirada} TB_DOACOES={item.TB_DOACOES} STATUS={item.STATUS} descricao={item.descricao} ID={item.ID} />}
                keyExtractor={item => item.ID}
            />
        </SafeAreaView>
    );
}

export default MinhasReservas;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D7E1D8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textStyleYes: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

 