import React, { useEffect, useState } from 'react'
import { Button, Flex, Heading } from '@chakra-ui/react'
import { protheus } from '../../api/protheus'
import { useNavigate } from 'react-router-dom'

const SIZE_PAGE = 20

export const Pagination = ({ paginationInfo, setPaginationInfo, setOrders, filters, setIsLoading, filtersInitial }) => {
    const [pageCurrent, setPageCurrent] = useState(paginationInfo.page)
    const navigate = useNavigate()

    useEffect(() => {
        setPageCurrent(paginationInfo.page)
    }, [paginationInfo])

    const handleSearch = async (newPage) => {
        setIsLoading(true)
        try {
            const params = { ...filters, pageSize: SIZE_PAGE, page: newPage }
            const response = await protheus.get('/protheus/orders', { params })
            const data = response.data
            setOrders(data.ordens_servico);
            setPaginationInfo({ page: data.page, hasNext: data.hasNext })
            setPageCurrent(newPage)
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

    const handleLeft = () => {
        handleSearch(pageCurrent - 1)
    }

    const handleRight = () => {
        handleSearch(pageCurrent + 1)
    }

    return (
        <Flex w='100%' justifyContent={'center'} alignItems={'center'} >
            <Button
                isDisabled={pageCurrent === 1}
                onClick={handleLeft} >
                {'<'}
            </Button>
            <Heading size={'md'} mr='3' ml='3'>{pageCurrent}</Heading>
            <Button
                isDisabled={!paginationInfo.hasNext}
                onClick={handleRight}>
                {'>'}
            </Button>
        </Flex >
    )
}
