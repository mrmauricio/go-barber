import React, { useState, useMemo, useEffect } from 'react';
import {
    format,
    subDays,
    addDays,
    setHours,
    setMinutes,
    setSeconds,
    isBefore,
    isEqual,
    parseISO,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '~/services/api';

import { Container, Time } from './styles';

// isso deveria ser trazido do back-end, é a range de horários que podem
// ser feitos os agendamentos
const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Dashboard() {
    const [schedule, setSchedule] = useState([]);
    const [date, setDate] = useState(new Date());

    const dateFormatted = useMemo(
        () => format(date, "d 'de' MMMM", { locale: pt }),
        [date]
    );

    useEffect(() => {
        async function loadSchedule() {
            const response = await api.get('schedule', {
                // query params
                params: { date },
            });

            // pega a timezone do usuário
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log(timezone);

            const data = range.map(hour => {
                // transforma a date atual em um horário cheio, para então
                // comparar com as datas dos agendamentos (back-end só per-
                // mite agendar em hora cheia)
                const checkDate = setSeconds(
                    setMinutes(setHours(date, hour), 0),
                    0
                );
                // transforma de UTC (horario global) para a timezone
                const compareDate = utcToZonedTime(checkDate, timezone);

                // informações que serão mostradas na tela: time = horarios,
                // past = caso ja tenha passado p/ aplicar o css, appoint =
                // verifica na API se teve algum agendamento pro horario
                return {
                    time: `${hour}:00h`,
                    past: isBefore(compareDate, new Date()),
                    appointment: response.data.find(a =>
                        isEqual(parseISO(a.date), compareDate)
                    ),
                };
            });

            // seta a array com os dados de agendamento
            setSchedule(data);
        }

        loadSchedule();
    }, [date]);

    function handlePrevDay() {
        setDate(subDays(date, 1));
    }

    function handleNextDay() {
        setDate(addDays(date, 1));
    }

    return (
        <Container>
            <header>
                <button type="button" onClick={handlePrevDay}>
                    <MdChevronLeft size={36} color="fff" />
                </button>
                <strong>{dateFormatted}</strong>
                <button type="button" onClick={handleNextDay}>
                    <MdChevronRight size={36} color="fff" />
                </button>
            </header>

            <ul>
                {schedule.map(time => (
                    <Time
                        key={time.time}
                        past={time.past}
                        available={!time.appointment}
                    >
                        <strong>{time.time}</strong>
                        <span>
                            {time.appointment
                                ? time.appointment.user.name
                                : 'Em Aberto'}
                        </span>
                    </Time>
                ))}
            </ul>
        </Container>
    );
}
