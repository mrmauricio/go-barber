import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
// parseISO converte um texto pra um Date JS, e format calcula a distancia
// entre duas datas
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import {
    Container,
    Badge,
    NotificationList,
    Scroll,
    Notification,
} from './styles';

export default function Notifications() {
    const [visible, setVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // useMemo: sempre que uma função for usada dentro do render(), essa hook
    // irá executá-la apenas se a variavel passada por parametro tiver seu
    // valor alterado. no caso, só irá buscar se tem alguma notificação não
    // lida quando o valor de alguma notificação for alterado, e não sempre
    // que renderizar novamente
    const hasUnread = useMemo(
        () =>
            // o find retorna a notificação em questão. se eu quisesse que retor-
            // nasse apenas se existe ou não (um bool), é só colocar Boolean() em
            // volta de tudo, ou !! antes.
            Boolean(
                notifications.find(notification => notification.read === false)
            ),
        [notifications]
    );

    // componentDidMount
    useEffect(() => {
        async function loadNotifications() {
            const response = await api.get('notifications');

            const data = response.data.map(notification => ({
                ...notification,
                timeDistance: formatDistance(
                    parseISO(notification.createdAt),
                    new Date(),
                    { addSuffix: true, locale: pt }
                ),
            }));

            setNotifications(data);
        }

        loadNotifications();
    }, []);

    function handleToggleVisible() {
        setVisible(!visible);
    }

    // quando clicada, manda um put pra alterar o campo read no BD e então
    // também altera o state local, assim setando a notification como lida.
    // então, na prop 'unread' da notification fica o valor que mostrará se
    // a bola laranja é mostrada ou nao
    async function handleMarkAsRead(id) {
        await api.put(`notifications/${id}`);

        // retorna todas as notificações do state; caso seja a clicada, altera
        // o 'read'. caso não, retorna ela da mesma forma de antes. então, o
        // setNotifications atualiza o state
        setNotifications(
            notifications.map(notification =>
                notification._id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }

    return (
        <Container>
            <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
                <MdNotifications color="7159c1" size={20} />
            </Badge>

            <NotificationList visible={visible}>
                <Scroll>
                    {notifications.map(notification => (
                        <Notification
                            key={notification._id}
                            unread={!notification.read}
                        >
                            <p>{notification.content}</p>
                            <time>{notification.timeDistance}</time>
                            {!notification.read && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleMarkAsRead(notification._id)
                                    }
                                >
                                    Marcar como lida
                                </button>
                            )}
                        </Notification>
                    ))}
                </Scroll>
            </NotificationList>
        </Container>
    );
}
