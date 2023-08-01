import React from 'react'
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const SIZE_TABLE = window.innerHeight > 800 ? '700px' : '500px'


function OrdersList({ orders }) {
    return (
        <TableContainer overflowY={'scroll'} h={SIZE_TABLE}>
            <Table variant='striped' >
                <Thead>
                    <Tr>
                        <Th>Filial</Th>
                        <Th>Nº Ordem</Th>
                        <Th>Cliente/Loja</Th>
                        <Th>Operação</Th>
                        <Th>Data/Hora Emissão</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody >
                    {orders?.map((order) => {
                        return (
                            <Tr key={order.numos}>
                                <Td>{order.filial}</Td>
                                <Td>{order.numos}</Td>
                                <Td>{order.cliente}/{order.loja}</Td>
                                <Td>{order.operacao}</Td>
                                <Td>{order.data_emissao} - {order.hora_emissao}</Td>
                                <Td>Em execução</Td>
                            </Tr>
                        )
                    })
                    }
                </Tbody>
            </Table>
        </TableContainer >
    )
}

export default OrdersList