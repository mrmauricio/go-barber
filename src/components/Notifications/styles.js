import styled, { css } from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { lighten } from 'polished';

export const Container = styled.div`
    position: relative;
`;

export const Badge = styled.button`
    background: none;
    border: 0;
    position: relative;

    ${props =>
        props.hasUnread &&
        css`
            /* adicionar conteúdo antes dos estilos do button fecharem*/
            &::after {
                position: absolute;
                right: 0
                top: 0;
                width: 8px;
                height: 8px;
                background: #ff892e;
                /* tag obrigatória */
                content: '';
                border-radius: 50%;
            }
        `}
`;

export const NotificationList = styled.div`
    position: absolute;
    width: 260px;
    /* calcula onde é o lugar que corresponde a 50% e então subtrai 130px, que
    é metade da width, da posição, fazendo ficar no meio com o sino*/
    left: calc(50% - 130px);
    top: calc(100% + 30px);
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    padding: 15px 5px;

    /* antes de abrir o elemento notificationList é inserida a seta, feita com
    css e posicionada bem ao centro desta */
    &::before {
        content: '';
        position: absolute;
        left: calc(50% - 20px);
        top: -20px;
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 20px solid rgba(0, 0, 0, 0.6);
    }
`;

export const Scroll = styled(PerfectScrollbar)`
    max-height: 260px;
    padding: 5px 15px;
`;

export const Notification = styled.div`
    color: #fff;

    /* toda notificação que for seguida por uma anterior, no caso a primera
    será ignorada, aplicando esse efeito pra 2ª 3ª 4ª etc */
    & + div {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    p {
        font-size: 13px;
        line-height: 18px;
    }

    time {
        font-size: 12px;
        opacity: 0.6;
    }

    button {
        font-size: 12px;
        border: 0;
        background: none;
        color: ${lighten(0.2, '#7139c1')};
        padding: 0 5px;
        margin: 0 5px;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    ${props =>
        props.unread &&
        css`
            &::after {
                content: '';
                display: inline-block;
                width: 7px;
                height: 7px;
                background: #ff892e;
                border-radius: 50%;
            }
        `}
`;
