export interface IReaderHistories {
    items: HistoryItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface HistoryItem {
    month: string;
    numberMonth: number;
    reader: string;
    year: number;
}