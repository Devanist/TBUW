export function dataToCSV(data) {
    const dataString = JSON.stringify(data);
    return `data:application/csv;charset=utf-8,${encodeURIComponent(dataString)}`;
}
