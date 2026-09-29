import express from 'express';
import { mitreMatrix, initialRunbooks } from '../db/data.js';
import { alertsStore } from './alerts.js';

const router = express.Router();

// Get MITRE coverage matrix
router.get('/', (req, res) => {
  // Dynamically calculate status based on active runbooks and alerts
  const enrichedMatrix = mitreMatrix.map(tactic => {
    return {
      ...tactic,
      techniques: tactic.techniques.map(tech => {
        const matchingAlert = alertsStore.find(a => a.mitreTTPs.some(ttp => ttp.id === tech.id));
        const matchingRunbook = initialRunbooks.find(r => r.mitreTechniques.includes(tech.id));
        
        let dynamicStatus = matchingRunbook ? 'COVERED' : 'GAP';
        if (matchingAlert && matchingAlert.status !== 'CONTAINED') {
          dynamicStatus = 'ACTIVE_ALERT';
        }

        return {
          ...tech,
          status: dynamicStatus,
          activeAlertId: matchingAlert ? matchingAlert.id : null,
          runbookId: matchingRunbook ? matchingRunbook.id : null
        };
      })
    };
  });

  const totalTechniques = enrichedMatrix.reduce((acc, t) => acc + t.techniques.length, 0);
  const coveredTechniques = enrichedMatrix.reduce((acc, t) => acc + t.techniques.filter(x => x.status === 'COVERED' || x.status === 'ACTIVE_ALERT').length, 0);
  const coveragePercentage = Math.round((coveredTechniques / totalTechniques) * 100);

  res.json({
    success: true,
    totalTechniques,
    coveredTechniques,
    coveragePercentage,
    matrix: enrichedMatrix
  });
});

export default router;
