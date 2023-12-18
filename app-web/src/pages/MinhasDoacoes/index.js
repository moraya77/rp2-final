import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Button, Modal, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../repository/supabase';

const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

function MinhasDoacoes({ route, navigation }) {
    const { user_id } = route.params;

    const [info, setInfo] = useState([]);

    const [isDataRendered, setIsDataRendered] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [currentId, setCurrentId] = useState('');

    async function fetchData() {
        setIsDataRendered(false);
        const { data, error } = await supabase
            .from("TB_DOACOES")
            .select('id,criada_em,quantidade_kg,status,descricao')
            .order('status', { ascending: false })
            .eq('user_id', user_id);

        setInfo(data);
        setIsDataRendered(true);
    }

    const doacaoColetada = async (id) => {
        setIsDataRendered(false);
        const { data, error } = await supabase
            .from('TB_DOACOES')
            .update({ status: 'Coletada' })
            .eq('id', id)
            .select()
        
        setModalVisible(!modalVisible);
        setIsDataRendered(true);

        fetchData();
    };

    const onButtonClick = (id) => {
        setCurrentId(id);
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const setColor = (status) => {
        if (status === 'Pendente') return 'blue'
        else if (status === 'Coletada') return 'green'
        else return 'red'
    };

    const Item = ({ criada_em, quantidade, status, descricao, id }) => (
        <View style={{ marginBottom: 20, borderWidth: 2, width: "100%", backgroundColor: 'white' }}>
            <Text style={{ fontSize: 18 }}>{descricao}</Text>
            <Text style={{ fontSize: 18 }}>Postada em: {criada_em.toLocaleDateString('pt-BR', options)} às {criada_em.getHours()}:{criada_em.getMinutes()}</Text>
            <Text style={{ fontSize: 18 }}>Quantidade: {quantidade}Kg</Text>
            {status === 'Pendente' &&
                <Button color={"blue"} title="Confirmar coleta" onPress={() => onButtonClick(id)}/>
            }
            <Text style={{ fontSize: 18, textAlign: 'right', color: setColor(status) }}>{status}</Text>
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
                        <Text style={styles.modalText}>Você deseja confirmar a coleta?</Text>
                        <View style={{ flexDirection: 'row' }}>
                        <Pressable
                            style={styles.button}
                            onPress={() => doacaoColetada(currentId)}>
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
                renderItem={({ item }) => <Item criada_em={new Date(item.criada_em)} quantidade={item.quantidade_kg} status={item.status} descricao={item.descricao} id={item.id} />}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

export default MinhasDoacoes;

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
