export class AppActions {
    public static SET_LOADING: string = 'SET_LOADING'
    public static SET_LOCATION: string = 'SET_LOCATION'
    public static SET_CACHE: string = 'SET_CACHE'
    public static CLEAR: string = 'CLEAR'

    public static setLoading (loading: boolean) {
        return {
            loading,
            type: AppActions.SET_LOADING,
        }
    }

    public static setLocation (location: string) {
        return {
            location,
            type: AppActions.SET_LOCATION,
        }
    }

    public static setCache (cache: Array<{ data: any, expires: number, url: string }>) {
        return {
            cache,
            type: AppActions.SET_CACHE,
        }
    }

    public static clear () {
        return {
            type: AppActions.CLEAR,
        }
    }
}
