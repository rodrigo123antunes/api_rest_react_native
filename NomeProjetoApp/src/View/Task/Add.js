import React from 'react';
import { StyleSheet, Alert, StatusBar } from 'react-native';
import { Container, Content, Button, Text, Left, Body, Right, Title, Input, Item, View, Fab, Form } from 'native-base';
import axios from 'axios';
import Icon from "react-native-vector-icons/dist/FontAwesome";
import Constants from '../../Util/Constants';

class Add extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'name': '',
            'description': ''
        }
    }

    save() {
        if (!this.state.name) {
            Alert.alert("Aviso", "O campo nome é obrigaorio.");

            return;
        } else if (!this.state.description) {
            Alert.alert("Aviso", "O campo descrição é obrigaorio.");

            return;
        }

        const data = {
            'name': this.state.name,
            'description': this.state.description
        };

        axios.post(Constants.API_URL + '/Tasks', data)
             .then(res => {
                Alert.alert('Aviso', 'Task cadastrada com sucesso');
                this.props.navigation.navigate("taskIndex");
            })
            .catch((err) => {
                Alert.alert('Erro' , err);
            });
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor="#0a5fa9" barStyle="light-content" />
                <Content padder>
                    <Button transparent onPress={() => {
                        this.props.navigation.navigate("taskIndex");
                    }}>
                        <Icon name="chevron-left" color={"#085191"} size={30} />
                    </Button>
                    <Form>
                        <Item>
                            <Input
                                placeholder={"Nome..."}
                                onChangeText={(e) => this.setState({"name": e})}
                                value={this.state.name}
                            />
                        </Item>
                        <Item>
                            <Input
                                placeholder={"Descrição..."}
                                onChangeText={(e) => this.setState({"description": e})}
                                value={this.state.description}
                            />
                        </Item>
                        <Button full block style={styles.btn} onPress={() => {
                            this.save();
                        }}>
                            <Text style={styles.textCenter}>{"Cadastrar"}</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    textCenter: {
        textAlign: 'center'
    },
    btn: {
        backgroundColor: '#085191'
    },
});

export default Add;
