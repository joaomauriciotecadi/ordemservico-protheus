import { Flex, Tag, Text } from '@chakra-ui/react'
import React from 'react'

export const AppliedFilters = ({ filters }) => {
    return (
        <Flex bg={'gray.200'} h='30px' alignItems={'center'} gap='2'>
            <Text>Filtros aplicados:</Text>
            {Object.entries(filters).map((filter => {
                if (!filter[1]) return null
                return (
                    <Tag key={filter[0]} variant='solid' colorScheme='teal'>
                        {`${filter[0]} : ${filter[1]}`}
                    </Tag>
                )
            }))}
        </Flex>
    )
}
