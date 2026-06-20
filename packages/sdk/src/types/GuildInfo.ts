export interface GuildInfo {
  id: string;
  name: string;
  iconURL: string | null;
  memberCount: number;
  createdAt: string;
}

export interface GuildLeft {
  guildId: string;
  leftAt: string;
}
