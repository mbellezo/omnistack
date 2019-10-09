import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard(){
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('http://192.168.56.1:3333', {
        query:{ user_id },
    }),[user_id]); // a conexão do usuário será refeita somente quando o user_id tiver sido alterada, por isso o parâmetro do user_id na função useMemo
    
    useEffect ( () => {

        // listener que irá observar se alguma mensagem para 'booking_request' chegou
        socket.on('booking_request', data => {
            setRequests( [...requests, data] );
        });

    }, [requests, socket] );
    
    // função realizada para carregar a página com a busca inicial
    useEffect ( () => {
        async function loadSpots(){
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });
            setSpots(response.data);
        }
        loadSpots();
    },[]);

    async function handleAccept(id){
        await api.post(`/bookings/${id}/approvals`);
        setRequests(requests.filter(request => request._id !== id));
    }
    async function handleReject(id){
        await api.post(`/bookings/${id}/rejections`);
        setRequests(requests.filter(request => request._id !== id));
    }
    return (
        <>
            <ul className="notifications">
                {requests.map(request =>(
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma nova reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.spot.date}</strong>
                        </p>
                        <button className="accept" onClick={()=>handleAccept(request._id)}>ACEITAR</button>
                        <button className="reject" onClick={()=>handleReject(request._id)}>REJEITAR</button>
                    </li>
                ))}
            </ul>
            <ul className="spot-list">
                {spots.map(spot=>(
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})`}} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ?  `R$ ${spot.price}/dia`: 'GRATUITO'}</span>
                    </li>
                ))}
            </ul>

            <Link to="/New"><button className="btn">Cadastrar novo Spot</button></Link>
        </>
    )
}