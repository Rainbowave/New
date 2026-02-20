
// Simulation of a backend queue service for user matching
// In a production app, this would make WebSocket or REST calls to the server

export const matchQueueService = {
    // Add user to the matchmaking queue
    joinQueue: async (userId: string) => {
        console.log(`[MatchQueue] User ${userId} joining queue...`);
        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 600));
        return { success: true, ticketId: 'ticket_' + Date.now() };
    },

    // Remove user from queue
    leaveQueue: async (userId: string) => {
        console.log(`[MatchQueue] User ${userId} leaving queue.`);
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { success: true };
    },

    // Poll for a match status (simulating a push notification or polling mechanism)
    waitForMatch: async (ticketId: string) => {
        console.log(`[MatchQueue] Waiting for match on ticket ${ticketId}...`);
        // Simulate variable wait time for a match
        const waitTime = Math.floor(Math.random() * 2000) + 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        
        // Mock a successful match result
        return { 
            matched: true, 
            peerId: 'peer_' + Math.random().toString(36).substr(2, 5),
            iceConfig: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        };
    }
};
