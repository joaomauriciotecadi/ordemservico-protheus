import { Button, Flex, Grid, GridItem, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { CiBoxes, CiShoppingBasket, CiLogout } from "react-icons/ci";

function Layout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate('/login')
    }

    return (
        <>
            <Grid
                templateAreas={`"nav main"`}
                gridTemplateRows={'1fr'}
                gridTemplateColumns={'1fr 5fr'}
                h='100vh'
                gap='1'
                color='blackAlpha.700'
            >
                <GridItem bg='blackAlpha.200' area={'nav'}>
                    <Flex h='100%' flexDirection={'column'} justifyContent={'space-between'}>
                        <Flex flexDirection={'column'}>
                            <Heading size='md' bg='blackAlpha.400' p='3'>Menu</Heading>
                            <VStack
                                align='stretch'
                                mt='5'
                            >
                                <Link to='/orders'>
                                    <Button leftIcon={<CiBoxes size='30' />} bg='none' colorScheme='telegram' borderRadius='0' color='black' w='100%'>
                                        <Text w='100%' textAlign={'start'} ml='2'>Monitor de Serviços</Text>
                                    </Button>
                                </Link>

                                <Link to='/main'>
                                    <Button leftIcon={<CiShoppingBasket size='30' />} bg='none' colorScheme='telegram' borderRadius='0' color='black' w='100%'>
                                        <Text w='100%' ml='2' textAlign={'start'}>Outros itens...</Text>
                                    </Button>
                                </Link>
                            </VStack>
                        </Flex>
                        <Button
                            leftIcon={<CiLogout />}
                            onClick={handleLogout}
                            colorScheme='red'
                            bg='none'
                            color='black'
                            justifyContent={'start'}
                            borderRadius='0'>Logout</Button>
                    </Flex>
                </GridItem>
                <GridItem pl='2' area={'main'}>
                    <Outlet />
                </GridItem>
            </Grid>

        </>
    )
}

export default Layout