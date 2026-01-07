import express from 'express';
import webrtcController from '../controllers/webrtc.controller.js';

const router = express.Router();

// Room management
router.post('/rooms/:roomId/join', webrtcController.joinRoom);
router.post('/rooms/:roomId/leave', webrtcController.leaveRoom);
router.get('/rooms/:roomId/participants', webrtcController.getParticipants);
router.patch('/rooms/:roomId/participants', webrtcController.updateParticipant);
router.get('/rooms', webrtcController.getActiveRooms);

export default router;
