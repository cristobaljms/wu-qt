"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Users, Target, Edit2, Check, X, UserPlus } from "lucide-react"

interface Player {
  id: number
  name: string
  score: number
}

export default function MatarAliensGame() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Jugador 1", score: 0 },
    { id: 2, name: "Jugador 2", score: 0 },
  ])
  const [currentTurn, setCurrentTurn] = useState(0)
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  const addPlayer = () => {
    if (players.length < 8) {
      const newPlayer: Player = {
        id: Date.now(),
        name: `Jugador ${players.length + 1}`,
        score: 0,
      }
      setPlayers([...players, newPlayer])
    }
  }

  const removePlayer = (playerId: number) => {
    if (players.length > 2) {
      const playerIndex = players.findIndex((p) => p.id === playerId)
      const newPlayers = players.filter((p) => p.id !== playerId)
      setPlayers(newPlayers)

      // Ajustar el turno actual si es necesario
      if (currentTurn >= newPlayers.length) {
        setCurrentTurn(0)
      } else if (playerIndex <= currentTurn && currentTurn > 0) {
        setCurrentTurn(currentTurn - 1)
      }
    }
  }

  const nextTurn = () => {
    setCurrentTurn((prev) => (prev + 1) % players.length)
  }

  const updateScore = (playerId: number, change: number) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, score: Math.max(0, player.score + change) } : player,
      ),
    )
  }

  const startEditingName = (playerId: number, currentName: string) => {
    setEditingPlayer(playerId)
    setEditName(currentName)
  }

  const savePlayerName = () => {
    if (editName.trim()) {
      setPlayers(players.map((player) => (player.id === editingPlayer ? { ...player, name: editName.trim() } : player)))
    }
    setEditingPlayer(null)
    setEditName("")
  }

  const cancelEditingName = () => {
    setEditingPlayer(null)
    setEditName("")
  }

  const resetGame = () => {
    setPlayers(players.map((player) => ({ ...player, score: 0 })))
    setCurrentTurn(0)
  }

  const currentPlayer = players[currentTurn]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Target className="h-10 w-10 text-green-400" />
            Matar QT
            <Target className="h-10 w-10 text-green-400" />
          </h1>
        </div>

        {/* Current Turn Display */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Turno Actual</h2>
              <div className="text-4xl font-bold text-white mb-4">{currentPlayer?.name}</div>
              <Button onClick={nextTurn} size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                Siguiente Turno
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Player Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Jugadores ({players.length}/8)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={addPlayer} disabled={players.length >= 8} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Agregar Jugador
              </Button>
              <Button onClick={resetGame} variant="destructive">
                Reiniciar Puntuaciones
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <Card
              key={player.id}
              className={`relative transition-all duration-300 ${
                index === currentTurn
                  ? "ring-4 ring-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
                  : "hover:shadow-lg"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {editingPlayer === player.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") savePlayerName()
                          if (e.key === "Escape") cancelEditingName()
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={savePlayerName}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditingName}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-semibold ${
                            index === currentTurn ? "text-green-700 dark:text-green-300" : ""
                          }`}
                        >
                          {player.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => startEditingName(player.id, player.name)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        {players.length > 2 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePlayer(player.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-4 ${
                      index === currentTurn ? "text-green-600 dark:text-green-400" : ""
                    }`}
                  >
                    {player.score}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateScore(player.id, -1)}
                      disabled={player.score === 0}
                      className="w-12 h-12"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateScore(player.id, 1)}
                      className="w-12 h-12 bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Estadísticas del Juego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{players.length}</div>
                <div className="text-sm text-muted-foreground">Jugadores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{Math.max(...players.map((p) => p.score))}</div>
                <div className="text-sm text-muted-foreground">Puntuación Máxima</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{players.reduce((sum, p) => sum + p.score, 0)}</div>
                <div className="text-sm text-muted-foreground">Total de Puntos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {players.find((_, i) => i === currentTurn)?.name.split(" ")[1] || "1"}
                </div>
                <div className="text-sm text-muted-foreground">Turno Actual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-600 dark:text-blue-400">
            <ul className="space-y-2 text-sm">
              <li>• El jugador actual está resaltado en verde</li>
              <li>• Usa los botones +1 y -1 para ajustar las puntuaciones</li>
              <li>• Haz clic en el icono de edición para cambiar nombres</li>
              <li>• Presiona "Siguiente Turno" cuando encuentres al alien difícil</li>
              <li>• Puedes tener entre 2 y 8 jugadores</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
