export interface Marker {
    position: Position;
    code: string;
    trt: string;
    phone?: string;
    photo?: string;
}

export interface Position {
    lat: number;
    lng: number;
}