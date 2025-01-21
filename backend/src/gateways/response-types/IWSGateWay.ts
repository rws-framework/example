export type IWSData = {
    wsId: string;
    data: string
  };
  
export type IWSResponse = {
  success: boolean;
  data: { wsId: string; error?: Error | any };
};