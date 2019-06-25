import React from 'react';
import { StyleSheet, Alert, StatusBar } from 'react-native';
import { Container, Content, Button, Text, Left, Body, Right, Title, List, ListItem, View, Fab } from 'native-base';
import axios from 'axios';
import Icon from "react-native-vector-icons/dist/FontAwesome";
import Constants from '../../Util/Constants';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'listTasks': [],
        }
    }

    async componentDidMount() {
        axios.get(Constants.API_URL + '/Tasks', {})
            .then(res => {
                this.setState({'listTasks': res.data});
            })
            .catch((err) => {
                Alert.alert('Erro', err);
            });
    }

    reloadList() {
        axios.get(Constants.API_URL + '/Tasks', {})
             .then(res => {
                this.setState({'listTasks': res.data});
            })
            .catch((err) => {
                Alert.alert('Erro' , err);
            });
    }

    delete(id) {
        axios.post(Constants.API_URL + '/Tasks/delete', {'id': id})
             .then(res => {
                Alert.alert('Aviso', 'Task excluida com sucesso');
                this.reloadList();
            })
            .catch((err) => {
                Alert.alert('Erro' , err);
            });
    }

    render() {
        var renderTasks = null;
        if (this.state.listTasks.length > 0) {
            renderTasks = this.state.listTasks.map((prop, key) => {
                return (
                    <ListItem key={key} onPress={() => this.props.navigation.navigate("taskEdit", {"id" : prop.id})}>
                        <Body>
                            <Text>{prop.name}</Text>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.delete(prop.id)}>
                                <Icon name="close" color="red" size={25} />
                            </Button>
                        </Right>
                    </ListItem>
                );
            });
        } else {
            renderTasks = <Text style={{textAlign: 'center'}}>{"Nenhuma task cadastrada."}</Text>
        }

        return (
            <Container>
                <StatusBar backgroundColor="#0a5fa9" barStyle="light-content" />
                <Content padder>
                    {renderTasks}
                </Content>
                <Fab
                    active={ true }
                    style={styles.fab}
                    direction="up"
                    position="bottomRight"
                    onPress={() => this.props.navigation.navigate('taskAdd')}
                >
                    <Icon name="plus" />
                </Fab>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: '#085191'
    },
});

export default Index;
