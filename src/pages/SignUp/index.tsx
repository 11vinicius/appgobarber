import React, { 
    useRef,
    useCallback
 } from 'react';
import { 
        Image,
        View,
        ScrollView,
        KeyboardAvoidingView,
        Platform,
        TextInput,
        Alert
     } from 'react-native';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup'; 
import getValidationErrors from '../../utils/getValidator'    


import LogoImg from '../../assets/logo.png';

import Input from '../../Components/input';
import Button from '../../Components/button';

import { Container,
        Title,
        BackToSignIn,
        BackToSignInText
    } from './styles';

const SignUp: React.FC = () =>{
    const formRef = useRef<FormHandles>(null)
    const navigation = useNavigation();

    const emailInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)

    interface SignInFormData{
        name: string;
        email: string;
        password: string;
    }

    const handleSignUp = useCallback(
        async (data: SignInFormData) => {
          try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
              name: Yup.string().required('Nome obrigatória'),
              email: Yup.string()
                .required('E-mail obrigatório')
                .email('Digite um e-mail válido'),
              password: Yup.string().min(6, 'No minimo 6 digitos'),
            });

            await schema.validate(data, {
              abortEarly: false,
            });
            
            await api.post('/users', data);
            
            Alert.alert('Cadasto realizado com sucesso',
                'Você já pode fazer login na aplicação.'
            );

            navigation.goBack();
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);
              formRef.current?.setErrors(errors);
              return;
            }

            Alert.alert(
                'Erro no cadastro',
                'Ocorreu um erro ao fazer cadastro, tente novamente',
            );
          }
        },
        [navigation],
      );

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView 
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{ flex:1 }}
                >
                    <Container>
                        <Image source={LogoImg}/>

                        <View>
                            <Title> Crie sua conta </Title>
                        </View>
                        <Form
                         ref={formRef}
                          onSubmit={handleSignUp}>
                            
                            <Input
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={()=>{
                                    emailInputRef.current?.focus();
                                }}
                            />

                            <Input 
                                keyboardType="email-address" 
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="email" 
                                icon="mail"
                                placeholder="E-mail" 
                                returnKeyType="next"
                                ref={emailInputRef}
                                onSubmitEditing={()=>{
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                secureTextEntry
                                textContentType="newPassword"
                                name="password"
                                icon="lock"
                                placeholder="Senha" 
                                returnKeyType="send"
                                ref={passwordInputRef}
                                onSubmitEditing={()=>formRef.current?.submitForm()}
                            />

                            <Button onPress={()=>formRef.current?.submitForm()}>Entrar</Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
              

            <BackToSignIn onPress={()=>navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#fff" />
                <BackToSignInText>Voltar para logon</BackToSignInText>
            </BackToSignIn>
        </>
    )
}

export default SignUp;