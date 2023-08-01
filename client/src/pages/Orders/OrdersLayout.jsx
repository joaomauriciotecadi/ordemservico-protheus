import React, { useState } from 'react'
import { protheus } from '../../api/protheus';
import { useNavigate } from 'react-router-dom';
import { AppliedFilters } from '../../components/AppliedFilters';
import { Pagination } from '../../components/Pagination';
import { Filters } from '../../components/Filters';
import { Box, Button, Center, Flex, Spinner } from '@chakra-ui/react';
import OrdersList from './OrdersList';

const filtersInitial = { filial: '', cliente: '', loja: '', datade: '', dataate: '' }

const SIZE_TABLE = window.innerHeight > 800 ? '700px' : '500px'
const SIZE_PAGE = 20

function OrdersLayout() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState()
    const [paginationInfo, setPaginationInfo] = useState({ page: 1, hasNext: false })
    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState(filtersInitial)


    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params = { ...filters, pageSize: SIZE_PAGE }
            const response = await protheus.get('/protheus/orders', { params })
            const data = response.data
            setOrders(data.ordens_servico);
            setPaginationInfo({ page: data.page, hasNext: data.hasNext })
        } catch (error) {
            setOrders([]);
            setPaginationInfo(filtersInitial)

            if (error) {
                alert('Sessão expirada, favor realizar um novo login.')
                navigate('/')
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            <Flex justifyContent={'space-between'} flexDirection={'column'}>
                <Flex justifyContent={'space-between'} p='2' alignItems={'center'}>
                    <Filters isLoading={isLoading} filters={filters} setFilters={setFilters} />
                    <Box>
                        <Button onClick={handleSearch} colorScheme='whatsapp' mr='2' isDisabled={isLoading}>Excel</Button>
                        <Button onClick={handleSearch} colorScheme='linkedin' mr='2' isDisabled={isLoading}>Busca Ordens</Button>

                    </Box>
                </Flex>
                <AppliedFilters filters={filters} />
            </Flex >
            {isLoading ? <Center h={SIZE_TABLE}>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                /> </Center> : <OrdersList orders={orders} />}


            {orders && < Pagination paginationInfo={paginationInfo} setPaginationInfo={setPaginationInfo} setOrders={setOrders} filters={filters} setIsLoading={setIsLoading} filtersInitial={filtersInitial} />}

        </>
    )
}

export default OrdersLayout