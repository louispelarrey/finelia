<?php

namespace App\Service;

class Calculate {

    /*
     * Prend en paramètre autant de notes que l'on souhaite et retourne une moyenne arrondie à 10^-2
     */
    public function moyenneCoef($marks): float
    {
        $totalMark = $coefTot = 0;
        foreach($marks as $mark)
        {
            $totalMark += $mark['mark'] * $mark['coef'];
            $coefTot += $mark['coef'];
        }
        $moyenne = $totalMark / $coefTot;

        return round($moyenne, 2);
    }
}