import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'

export const Filters = ({ isLoading, filters, setFilters }) => {

    const handleFilters = (e) => {
        setFilters({ ...filters, [e.target.id]: e.target.value })
    }

    return (
        <Flex gap='2' m='2'>
            <FormControl>
                <FormLabel>Filial</FormLabel>
                <Input id='filial' type='text' placeholder='Filial' maxLength={3} onChange={handleFilters} value={filters.filial} />
            </FormControl>
            <FormControl>
                <FormLabel>Cliente</FormLabel>
                <Input id='cliente' type='text' placeholder='Cliente' maxLength={6} onChange={handleFilters} value={filters.cliente} />
            </FormControl>
            <FormControl>
                <FormLabel>Loja</FormLabel>
                <Input id='loja' type='text' placeholder='Loja' maxLength={2} onChange={handleFilters} value={filters.loja} />
            </FormControl>
            <FormControl>
                <FormLabel>Data De</FormLabel>
                <Input id='datade' type='date' onChange={handleFilters} />
            </FormControl>
            <FormControl>
                <FormLabel>Data Até</FormLabel>
                <Input id='dataate' type='date' onChange={handleFilters} />
            </FormControl>
        </Flex>

    )
}
