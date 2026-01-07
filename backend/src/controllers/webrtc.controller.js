/**
 * WebRTC Controller (ESM)
 * Handles room management and signaling for peer-to-peer video connections
 */
import { emitToClass } from '../utils/socket.js';

// In-memory room storage (use Redis for production)
const rooms = new Map();

/**
 * Create or join a room
 */
export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, userName, role } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({ message: 'Room ID and User ID required' });
    }

    // Get or create room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        participants: [],
        createdAt: new Date(),
        teacher: null,
      });
    }

    const room = rooms.get(roomId);

    // Check if user already in room
    const existingParticipant = room.participants.find((p) => p.userId === userId);
    if (existingParticipant) {
      return res.json({
        success: true,
        room: {
          id: room.id,
          participants: room.participants,
          isTeacher: room.teacher === userId,
        },
      });
    }

    // Add participant
    const participant = {
      userId,
      userName: userName || 'Guest',
      role: role || 'student',
      audio: true,
      video: true,
      handRaised: false,
      joinedAt: new Date(),
    };

    room.participants.push(participant);
    // Notify class listeners
    try { emitToClass(roomId, 'webrtc:participants', { roomId, participants: room.participants }); } catch {}

    // Set teacher if first teacher joins
    if (role === 'teacher' && !room.teacher) {
      room.teacher = userId;
    }

    res.json({
      success: true,
      room: {
        id: room.id,
        participants: room.participants,
        isTeacher: room.teacher === userId,
      },
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Failed to join room', error: error.message });
  }
};

/**
 * Leave a room
 */
export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!rooms.has(roomId)) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms.get(roomId);
    room.participants = room.participants.filter((p) => p.userId !== userId);
    // Notify class listeners
    try { emitToClass(roomId, 'webrtc:participants', { roomId, participants: room.participants }); } catch {}

    // Remove room if empty
    if (room.participants.length === 0) {
      rooms.delete(roomId);
    }

    res.json({ success: true, message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ message: 'Failed to leave room', error: error.message });
  }
};

/**
 * Get room participants
 */
export const getParticipants = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!rooms.has(roomId)) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms.get(roomId);

    res.json({
      success: true,
      participants: room.participants,
      teacherId: room.teacher,
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Failed to get participants', error: error.message });
  }
};

/**
 * Update participant status
 */
export const updateParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, audio, video, handRaised } = req.body;

    if (!rooms.has(roomId)) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms.get(roomId);
    const participant = room.participants.find((p) => p.userId === userId);

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Update participant
    if (audio !== undefined) participant.audio = audio;
    if (video !== undefined) participant.video = video;
    if (handRaised !== undefined) participant.handRaised = handRaised;

    // Notify class listeners
    try { emitToClass(roomId, 'webrtc:participants', { roomId, participants: room.participants }); } catch {}

    res.json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error('Update participant error:', error);
    res.status(500).json({ message: 'Failed to update participant', error: error.message });
  }
};

/**
 * Get all active rooms (admin only)
 */
export const getActiveRooms = async (req, res) => {
  try {
    const roomsList = Array.from(rooms.values()).map((room) => ({
      id: room.id,
      participantCount: room.participants.length,
      teacher: room.participants.find((p) => p.userId === room.teacher)?.userName,
      createdAt: room.createdAt,
    }));

    res.json({
      success: true,
      rooms: roomsList,
      totalRooms: rooms.size,
    });
  } catch (error) {
    console.error('Get active rooms error:', error);
    res.status(500).json({ message: 'Failed to get rooms', error: error.message });
  }
};

export default {
  joinRoom,
  leaveRoom,
  getParticipants,
  updateParticipant,
  getActiveRooms,
};
