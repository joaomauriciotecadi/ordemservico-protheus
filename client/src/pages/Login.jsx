import { Button, Center, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { protheus } from '../api/protheus'
import { CiLogin } from 'react-icons/ci'

const Login = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [loginInput, setLoginInput] = useState({})

    const handleLoginInput = (e) => {
        setLoginInput({ ...loginInput, [e.target.id]: e.target.value })
    }

    const handleLogin = async () => {
        console.log(loginInput);
        setIsLoading(true)
        try {
            const response = await protheus.post('/protheus/auth', loginInput)
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            navigate('/')
        } catch (error) {
            alert('Usuário não autenticado.')
        }
        setIsLoading(false)
    }

    return (
        <>
            {
                isLoading ?
                    <Center h='100vh'>
                        < Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Center > :
                    <Center h='100vh'>
                        <Flex w='20%' flexDirection={'column'} >
                            <Heading mb='10'>WMS - Protheus</Heading>
                            <FormControl as='fieldset'>
                                <FormLabel>
                                    Usuário
                                </FormLabel>
                                <Input id='user' onChange={handleLoginInput} />
                                <FormLabel>
                                    Senha
                                </FormLabel>
                                <Input id='password' type='password' onChange={handleLoginInput} />
                                <FormHelperText>Usuário/Senha Protheus.</FormHelperText>
                                <Button mt='5' leftIcon={<CiLogin size='20' />} onClick={handleLogin} colorScheme='blue' isDisabled={isLoading} w='100%'>Login</Button>
                            </FormControl>
                        </Flex>
                    </Center>}
        </>
    )
}

export default Login