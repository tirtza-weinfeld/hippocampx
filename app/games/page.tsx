import Link from "next/link"

export default function Games() {


    const games = [
        {
            title: "Tic Tac Toe",
            description: "A game of Tic Tac Toe",
            href: "/games/tic-tac-toe"
        }
        ,
        {
            title: "Math",
            description: "A game of Math",
            href: "/games/math"
        }
    ]
    return <div>
        {games.map((game) => (
            <Link href={game.href} key={game.href}>
                <h1>{game.title}</h1>
            </Link>
        ))}
    </div>
}
