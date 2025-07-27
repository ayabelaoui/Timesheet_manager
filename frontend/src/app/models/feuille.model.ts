import { Horaire } from './horaire.model';

export interface Feuille {
    id: number;
    soumise: boolean;
    statut?: string;
    horaires: Horaire[];
    totalHeures: number;
}
