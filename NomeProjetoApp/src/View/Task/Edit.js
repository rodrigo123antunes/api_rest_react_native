import React from 'react';
import { StyleSheet, Alert, StatusBar } from 'react-native';
import { Container, Content, Button, Text, Left, Body, Right, Title, Input, Item, View, Fab, Form } from 'native-base';
import axios from 'axios';
import Icon from "react-native-vector-icons/dist/FontAwesome";
import Constants from '../../Util/Constants';

class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'id': props.navigation.getParam("id"),
            'name': '',
            'description': ''
        }
    }

    componentDidMount() {
        const data = {
            "id": this.state.id
        };

        axios.get(Constants.API_URL + '/Tasks/findBy' + '?id=' + this.state.id)
             .then(res => {
                 if (res.data.length > 0) {
                     this.setState({
                         "name": res.data[0].name,
                         "description": res.data[0].description
                     });
                 }
            })
            .catch((err) => {
                Alert.alert('Erro' , err.toString());
            });
    }

    update() {
        const data = {
            'name': this.state.name,
            'description': this.state.description
        };

        axios.put(Constants.API_URL + '/Tasks/' + this.state.id, data)
             .then(res => {
                Alert.alert('Aviso', 'Task cadastrada com sucesso');
                this.props.navigation.navigate('taskIndex');
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
                        <Button full block primary style={styles.btn} onPress={() => {
                            this.update();
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

export default Edit;
