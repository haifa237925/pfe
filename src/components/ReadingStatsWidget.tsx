import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Trophy,
  Zap
} from 'lucide-react';

interface ReadingStats {
  dailyGoal: number;
  dailyProgress: number;
  weeklyReadingTime: number;
  monthlyBooks: number;
  monthlyGoal: number;
  currentStreak: number;
  totalBooksRead: number;
  averageRating: number;
  favoriteGenre: string;
  badges: string[];
}

interface ReadingStatsWidgetProps {
  stats: ReadingStats;
  className?: string;
}

export const ReadingStatsWidget: React.FC<ReadingStatsWidgetProps> = ({ 
  stats, 
  className = '' 
}) => {
  const dailyProgressPercentage = (stats.dailyProgress / stats.dailyGoal) * 100;
  const monthlyProgressPercentage = (stats.monthlyBooks / stats.monthlyGoal) * 100;

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
          📊 Mes Statistiques
        </h3>
        <TrendingUp className="h-6 w-6 text-primary-600" />
      </div>

      <div className="space-y-6">
        {/* Objectif quotidien */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium text-neutral-900 dark:text-white">
                Objectif quotidien
              </span>
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {stats.dailyProgress}h / {stats.dailyGoal}h
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(dailyProgressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {dailyProgressPercentage >= 100 ? '🎉 Objectif atteint !' : `${Math.round(dailyProgressPercentage)}% complété`}
          </p>
        </div>

        {/* Objectif mensuel */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium text-neutral-900 dark:text-white">
                Livres ce mois
              </span>
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {stats.monthlyBooks} / {stats.monthlyGoal}
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(monthlyProgressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {monthlyProgressPercentage >= 100 ? '🏆 Objectif dépassé !' : `${Math.round(monthlyProgressPercentage)}% complété`}
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-5 w-5 text-orange-500 mr-1" />
              <span className="text-2xl font-bold text-orange-600">
                {stats.currentStreak}
              </span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              jours consécutifs
            </p>
          </div>

          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-5 w-5 text-purple-500 mr-1" />
              <span className="text-2xl font-bold text-purple-600">
                {stats.badges.length}
              </span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              badges obtenus
            </p>
          </div>
        </div>

        {/* Temps de lecture hebdomadaire */}
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Cette semaine
            </span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {stats.weeklyReadingTime}h
          </span>
        </div>

        {/* Genre préféré */}
        <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-pink-500 mr-2" />
            <span className="font-medium text-pink-900 dark:text-pink-100">
              Genre préféré
            </span>
          </div>
          <span className="text-sm font-medium text-pink-600 bg-pink-100 dark:bg-pink-800 px-2 py-1 rounded-full">
            {stats.favoriteGenre}
          </span>
        </div>

        {/* Badges récents */}
        {stats.badges.length > 0 && (
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-white mb-3 flex items-center">
              <Trophy className="h-4 w-4 text-amber-500 mr-2" />
              Derniers badges
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.badges.slice(0, 3).map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs rounded-full"
                >
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};