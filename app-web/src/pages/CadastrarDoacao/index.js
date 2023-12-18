import { View, Text, Button, TextInput, Modal, Alert, Pressable, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../repository/supabase';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

Icon.loadFont();

const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

function CadastrarDoacao({ route, navigation }) {
    const { user_id } = route.params;
    const [descricao, setDescricao] = useState('');
    const [qtdAlimento, setQtdAlimento] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    const [isRendering, setIsRendering] = useState(false);

    let brazilCurrentDate = new Date();
    brazilCurrentDate.setHours(brazilCurrentDate.getHours() - 3);

    let minimunHour = new Date();
    minimunHour.setHours(minimunHour.getHours() - 2);

    const [date, setDate] = useState(brazilCurrentDate);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
            minimumDate: minimunHour,
            timeZoneName: 'America/Sao_Paulo'
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const doacaoSubmit = async (e) => {
        setIsRendering(true);
        e.preventDefault();

        let { data, error } = await supabase
            .from("TB_DOACOES")
            .select('id')
            .eq('user_id', user_id)
            .eq('status', 'Pendente');

        if (data.length < 5) {

            const { data, error } = await supabase.from("TB_DOACOES").insert([
                {
                    user_id: user_id,
                    descricao: descricao,
                    quantidade_kg: parseFloat(qtdAlimento),
                    disponivel_ate: date.toLocaleString("pt-BR"),
                },
            ]);
            setModalText('Doação postada com sucesso');
            setIsSuccess(true);
            setModalVisible(true);
        } else {
            setModalText('Você tem 1 doação pendente');
            setIsSuccess(false);
            setModalVisible(true);
        }

        setDescricao('');
        setQtdAlimento('');
        setIsRendering(false);
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" animating={isRendering} />
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
                        {isSuccess ? (
                            <Icon name="check-circle" size={25} color="green" />
                        )
                            : (
                                <Icon name="error-outline" size={25} color="red" />
                            )
                        }
                        <Text style={styles.modalText}>{modalText}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text style={styles.texts}>Descrição dos alimentos:</Text>
            <TextInput
                placeholder="Ex: Arroz, feijao e frango"
                value={descricao}
                onChangeText={(e) => setDescricao(e)}
                style={styles.inputDescricao}
            />

            <Text style={styles.texts}>Quantidade de alimentos (Kg):</Text>
            <TextInput
                placeholder="Ex: 4"
                value={qtdAlimento}
                onChangeText={(e) => setQtdAlimento(e)}
                style={styles.input}
                keyboardType='numbers-and-punctuation'
            />

            <Text style={styles.texts}>Selecione a data máxima para retirada:</Text>
            <SafeAreaView style={{ flexDirection: 'row' }}>
                <Button onPress={showDatepicker} title="Dia " />
                <Button onPress={showTimepicker} title="Horário" />
            </SafeAreaView>
            <Text style={{ marginBottom: 50 }}>Doação disponível até: {date.toLocaleDateString('pt-BR', options)} às {date.getHours()}:{date.getMinutes()}</Text>

            <Button color={"#006400"} title="Cadastrar" onPress={doacaoSubmit} />
        </View>
    );
}

export default CadastrarDoacao;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D7E1D8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        width: 150,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        marginBottom: 50,
    },
    inputDescricao: {
        height: 50,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        marginBottom: 50,
    },
    texts: {
        fontSize: 18,
        fontWeight: 'bold',
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
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
