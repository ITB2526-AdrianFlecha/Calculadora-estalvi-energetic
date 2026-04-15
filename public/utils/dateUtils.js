import { SCHOOL_YEAR, SPECIAL_PERIODS } from './constants.js';

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function parseDate(dateString) {
    return new Date(dateString);
}

export function isSchoolYear(date) {
    const month = date.getMonth() + 1; // getMonth retorna 0-11
    const day = date.getDate();

    // Septiembre a Junio (9 a 6)
    if (month >= SCHOOL_YEAR.startMonth || month <= SCHOOL_YEAR.endMonth) {
        if (month === SCHOOL_YEAR.startMonth && day < SCHOOL_YEAR.startDay) {
            return false;
        }
        if (month === SCHOOL_YEAR.endMonth && day > SCHOOL_YEAR.endDay) {
            return false;
        }
        return true;
    }

    return false;
}

export function isSpecialPeriod(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Setmana Santa (Marzo-Abril)
    if (month === SPECIAL_PERIODS.easter.startMonth && day >= SPECIAL_PERIODS.easter.startDay) {
        return 'easter';
    }
    if (month === SPECIAL_PERIODS.easter.endMonth && day <= SPECIAL_PERIODS.easter.endDay) {
        return 'easter';
    }

    // Estiu (Julio-Agosto)
    if ((month === SPECIAL_PERIODS.summer.startMonth || month === SPECIAL_PERIODS.summer.endMonth) &&
        (month === SPECIAL_PERIODS.summer.startMonth && day >= SPECIAL_PERIODS.summer.startDay ||
         month === SPECIAL_PERIODS.summer.endMonth && day <= SPECIAL_PERIODS.summer.endDay)) {
        return 'summer';
    }

    // Nadal (Diciembre-Enero)
    if (month === SPECIAL_PERIODS.christmas.startMonth && day >= SPECIAL_PERIODS.christmas.startDay) {
        return 'christmas';
    }
    if (month === SPECIAL_PERIODS.christmas.endMonth && day <= SPECIAL_PERIODS.christmas.endDay) {
        return 'christmas';
    }

    return null;
}

export function getDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

export function getMonthName(month) {
    const names = [
        'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
        'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
    ];
    return names[month - 1] || 'Desconegut';
}

export function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function getCurrentSchoolYear() {
    const now = new Date();
    const month = now.getMonth() + 1;

    if (month >= SCHOOL_YEAR.startMonth) {
        return `${now.getFullYear()}/${now.getFullYear() + 1}`;
    } else {
        return `${now.getFullYear() - 1}/${now.getFullYear()}`;
    }
}