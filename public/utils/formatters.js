export function formatNumber(value) {
    if (typeof value !== 'number') {
        return '0.00';
    }

    return new Intl.NumberFormat('ca-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatCurrency(value) {
    if (typeof value !== 'number') {
        return '0,00 €';
    }

    return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

export function formatPercentage(value) {
    if (typeof value !== 'number') {
        return '0%';
    }

    return `${(value * 100).toFixed(2)}%`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ca-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

export function formatDateShort(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ca-ES', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

export function formatTime(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ca-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

export function abbreviateNumber(value) {
    if (typeof value !== 'number') {
        return '0';
    }

    const absValue = Math.abs(value);
    let divisor = 1;
    let suffix = '';

    if (absValue >= 1000000) {
        divisor = 1000000;
        suffix = 'M';
    } else if (absValue >= 1000) {
        divisor = 1000;
        suffix = 'k';
    }

    return `${(value / divisor).toFixed(2)}${suffix}`;
}

export function truncateString(str, maxLength) {
    if (typeof str !== 'string') {
        return '';
    }

    if (str.length <= maxLength) {
        return str;
    }

    return str.substring(0, maxLength) + '...';
}