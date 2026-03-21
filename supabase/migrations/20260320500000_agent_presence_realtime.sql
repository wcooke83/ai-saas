-- Enable Realtime on agent_presence so the dashboard can subscribe to changes
ALTER PUBLICATION supabase_realtime ADD TABLE agent_presence;
