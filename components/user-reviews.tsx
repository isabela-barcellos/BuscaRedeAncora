"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type Review = {
  id: string
  user: {
    name: string
    avatar?: string
    location: string
  }
  rating: number
  date: string
  comment: string
  likes: number
  liked?: boolean
}

const initialReviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "São Paulo, SP",
    },
    rating: 5,
    date: "15/05/2023",
    comment:
      "Encontrei exatamente a peça que precisava para um Fiat Palio 2015. Preço justo e entrega rápida. Recomendo!",
    likes: 24,
  },
  {
    id: "2",
    user: {
      name: "Marcos Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Rio de Janeiro, RJ",
    },
    rating: 4,
    date: "03/04/2023",
    comment: "App muito útil para nós mecânicos. Economizei tempo na busca de peças para um Honda Civic 2018.",
    likes: 18,
  },
  {
    id: "3",
    user: {
      name: "Ana Costa",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Belo Horizonte, MG",
    },
    rating: 5,
    date: "22/03/2023",
    comment:
      "Excelente catálogo! Encontrei um kit de embreagem para um Volkswagen Gol que estava difícil de achar em outros lugares.",
    likes: 32,
  },
]

export function UserReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showAll, setShowAll] = useState(false)

  const handleLike = (id: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === id) {
          return {
            ...review,
            likes: review.liked ? review.likes - 1 : review.likes + 1,
            liked: !review.liked,
          }
        }
        return review
      }),
    )
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2)

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-6">
      <CardHeader className="bg-gradient-to-r from-[#012d48] to-[#012039] text-white rounded-t-xl py-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4" />
          Avaliações de Mecânicos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-[#de868b]/20 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-[#de868b]/20">
                    <AvatarFallback className="bg-[#012d48] text-white text-xs">
                      {review.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                    {review.user.avatar && (
                      <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-[#012039]">{review.user.name}</p>
                    <p className="text-xs text-[#012039]/60">{review.user.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-xs text-[#012039]/60 ml-1">{review.date}</span>
                </div>
              </div>
              <p className="text-sm text-[#012039] mb-3">{review.comment}</p>
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs flex items-center gap-1 rounded-full px-3 py-1 ${
                  review.liked
                    ? "bg-[#c42130]/10 text-[#c42130] hover:bg-[#c42130]/20"
                    : "text-[#012039]/70 hover:bg-[#012039]/10"
                }`}
                onClick={() => handleLike(review.id)}
              >
                <ThumbsUp className={`w-3 h-3 ${review.liked ? "fill-[#c42130]" : ""}`} />
                <span>{review.likes}</span>
              </Button>
            </div>
          ))}

          {reviews.length > 2 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-[#de868b]/30 text-[#012039] hover:bg-[#de868b]/10"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Mostrar menos" : `Ver mais ${reviews.length - 2} avaliações`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
