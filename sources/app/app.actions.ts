export class AppActions {
    public static SET_APP_STATE: string = 'SET_APP_STATE'

    public static setAppState (state: any) {
        return {
            type: AppActions.SET_APP_STATE,
            state,
        }
    }

    public static setLoading (loading: boolean) {
        return {
            state: { loading },
            type: AppActions.SET_APP_STATE,
        }
    }
}
