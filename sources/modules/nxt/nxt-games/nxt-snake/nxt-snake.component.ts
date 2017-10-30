import { Component, ViewEncapsulation } from '@angular/core'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-snake',
    styles: [ require('./_nxt-snake.component.scss') ],
    template: require('./_nxt-snake.component.html'),
})

export class NxtSnakeComponent {
    public map: any[] = []
    public score: number = 0
    public gameIsOver: boolean = false

    private mapSize: number = 20
    private snake: NxtSnake = new NxtSnake()
    private interval: any
    private apple: any = { x: 0, y: 0 }

    public ngOnInit () {
        this.startGame()

        document.addEventListener('keydown', (e) => {
            this.snake.setCurrentDirection(this.convertKeyToDirection(e.keyCode))

            return false
        })
    }

    public ngOnDestroy () {
        clearInterval(this.interval)
    }

    public startGame () {
        this.gameIsOver = false
        this.score = 0
        this.snake = new NxtSnake()
        this.resetMap()
        this.placeRandomlyApple()

        this.interval = setInterval(() => {
            const coordinates = this.snake.getSnake()[0]

            switch (this.snake.getCurrentDirection()) {
                case NxtSnake.DIRECTION_UP:
                    coordinates.y--
                    break
                case NxtSnake.DIRECTION_LEFT:
                    coordinates.x--
                    break
                case NxtSnake.DIRECTION_DOWN:
                    coordinates.y++
                    break
                case NxtSnake.DIRECTION_RIGHT:
                    coordinates.x++
                    break
                default:
                    return false
            }

            if (
                coordinates.y > -1 &&
                coordinates.y < this.map.length &&
                coordinates.x > -1 &&
                coordinates.x < this.map[coordinates.y].length &&
                (
                    this.map[coordinates.y][coordinates.x].type === 'blank' ||
                    this.map[coordinates.y][coordinates.x].type === 'apple'
                )
            ) {
                if (this.map[coordinates.y][coordinates.x].type === 'apple') {
                    this.score++
                    this.placeRandomlyApple()
                    this.snake.eatApple()
                }

                this.snake.setCoordinates(coordinates)
            } else {
                this.gameOver()
            }

            this.updateMap()
        }, 100)
    }

    private gameOver () {
        clearInterval(this.interval)
        this.gameIsOver = true
    }

    private convertKeyToDirection (key: number): number {
        switch (key) {
            case 38: // UP
                return NxtSnake.DIRECTION_UP
            case 37: // LEFT
                return NxtSnake.DIRECTION_LEFT
            case 40: // DOWN
                return NxtSnake.DIRECTION_DOWN
            case 39: // RIGHT
                return NxtSnake.DIRECTION_RIGHT
            default:
                return this.snake.getCurrentDirection()
        }
    }

    private placeRandomlyApple () {
        let placed: boolean = false

        do {
            const x: number = Math.floor(Math.random() * this.mapSize)
            const y: number = Math.floor(Math.random() * this.mapSize)

            if (this.map[y][x].type === 'blank') {
                placed = true
                this.apple.x = x
                this.apple.y = y
            }
        } while (!placed)
    }

    private updateMap () {
        this.resetMap()

        this.snake.getSnake().forEach((row) => {
            this.map[row.y][row.x].type = 'snake'
        })

        this.map[this.apple.y][this.apple.x].type = 'apple'
    }

    private resetMap () {
        this.map = []
        for (let i = 0; i < this.mapSize; i++) {
            const line: any[] = []

            for (let j = 0; j < this.mapSize; j++) {
                line.push({ type: 'blank' })
            }

            this.map.push(line)
        }
    }
}

class NxtSnake {
    public static DIRECTION_UP: number = 1
    public static DIRECTION_LEFT: number = 2
    public static DIRECTION_DOWN: number = 3
    public static DIRECTION_RIGHT: number = 4

    private snake: any[] = [ { x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 } ]
    private currentDirection: number = NxtSnake.DIRECTION_RIGHT

    public getSnake (): any[] {
        return [
            ...this.snake.map((s) => {
                return { x: s.x, y: s.y }
            }),
        ]
    }

    public setCoordinates ({ x, y }) {
        for (let i = this.snake.length - 1; i > 0; i--) {
            this.snake[i].x = this.snake[i - 1].x
            this.snake[i].y = this.snake[i - 1].y
        }

        this.snake[0].x = x
        this.snake[0].y = y
    }

    public getCurrentDirection (): number {
        return this.currentDirection
    }

    public setCurrentDirection (direction: number) {
        if (this.isValidDirection(direction)) {
            this.currentDirection = direction
        }
    }

    public eatApple () {
        this.snake.push({
            x: this.snake[this.snake.length - 1].x,
            y: this.snake[this.snake.length - 1].y,
        })
    }

    private isValidDirection (direction: number) {
        const currenDirection: number = this.getCurrentDirection()

        if (direction === NxtSnake.DIRECTION_UP && currenDirection === NxtSnake.DIRECTION_DOWN) {
            return false
        } else if (direction === NxtSnake.DIRECTION_DOWN && currenDirection === NxtSnake.DIRECTION_UP) {
            return false
        } else if (direction === NxtSnake.DIRECTION_LEFT && currenDirection === NxtSnake.DIRECTION_RIGHT) {
            return false
        } else if (direction === NxtSnake.DIRECTION_RIGHT && currenDirection === NxtSnake.DIRECTION_LEFT) {
            return false
        } else {
            return true
        }
    }
}
