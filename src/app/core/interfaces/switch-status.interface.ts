export interface SwitchStatus {
    id: string;
    valve: boolean | null;         
    solenoidValve: boolean | null;
    bomb: boolean | null;
    circuit: boolean | null;
    raspberry: boolean | null;
}
