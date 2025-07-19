import React, { useState } from 'react';
import { Flag, CheckCircle, XCircle, MessageCircle, AlertTriangle, Eye, Ban, Trash2, FileText, User, BookOpen } from 'lucide-react';

interface Report {
  id: string;
  type: 'book' | 'review' | 'user';
  title: string;
  reportedBy: string;
  reportDate: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
  contentId?: string;
  description?: string;
}

const DUMMY_REPORTS: Report[] = [
  {
    id: '1',
    type: 'book',
    title: 'Inappropriate Content in Chapter 3',
    reportedBy: 'john@example.com',
    reportDate: '2024-03-15T10:30:00',
    reason: 'Contains explicit content not suitable for the specified age rating',
    status: 'pending',
    severity: 'high',
    contentId: 'book_123',
    description: 'Le chapitre 3 contient du contenu explicite non approprié pour la classification d\'âge spécifiée.'
  },
  {
    id: '2',
    type: 'review',
    title: 'Spam Review',
    reportedBy: 'jane@example.com',
    reportDate: '2024-03-14T15:45:00',
    reason: 'Multiple identical reviews from the same user',
    status: 'resolved',
    severity: 'medium',
    contentId: 'review_456',
    description: 'Utilisateur publiant des avis identiques multiples pour manipuler les notes.'
  },
  {
    id: '3',
    type: 'user',
    title: 'Harassment Report',
    reportedBy: 'mike@example.com',
    reportDate: '2024-03-13T09:20:00',
    reason: 'User sending inappropriate messages',
    status: 'pending',
    severity: 'high',
    contentId: 'user_789',
    description: 'Utilisateur envoyant des messages inappropriés et harcelants à d\'autres membres.'
  }
];

const ContentModerationPage: React.FC = () => {
  const [reports] = useState<Report[]>(DUMMY_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const getSeverityColor = (severity: Report['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'resolved':
        return 'text-green-600 bg-green-50';
      case 'dismissed':
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'book':
        return <AlertTriangle className="h-5 w-5" />;
      case 'review':
        return <MessageCircle className="h-5 w-5" />;
      case 'user':
        return <Flag className="h-5 w-5" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const statusMatch = filterStatus === 'all' || report.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || report.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const highPriorityCount = reports.filter(r => r.severity === 'high' && r.status === 'pending').length;

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Content Moderation</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Pending Reports</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Flag className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Resolved Today</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{reports.filter(r => r.status === 'resolved').length}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">High Priority</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{highPriorityCount}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
            <select
              className="rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="resolved">Résolus</option>
              <option value="dismissed">Rejetés</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Priorité</label>
            <select
              className="rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-neutral-900">Signalements ({filteredReports.length})</h2>
            <div className="text-sm text-neutral-500">
              {pendingCount} en attente • {highPriorityCount} priorité haute
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-6 hover:bg-neutral-50 cursor-pointer transition-colors"
              onClick={() => handleReportClick(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    report.type === 'book' ? 'bg-red-100 text-red-600' :
                    report.type === 'review' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">{report.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{report.description || report.reason}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-neutral-500">
                        Reported by: {report.reportedBy}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(report.reportDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-neutral-500">
                        ID: {report.contentId}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                  {report.status === 'pending' && (
                    <div className="flex space-x-2 mt-2">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-xs">
                        <Ban className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">Aucun signalement trouvé avec ces filtres.</p>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {isDetailsModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-neutral-900">Détails du Signalement</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Type de contenu</label>
                <div className="mt-1 flex items-center">
                  <div className={`p-2 rounded-full mr-2 ${
                    selectedReport.type === 'book' ? 'bg-red-100 text-red-600' :
                    selectedReport.type === 'review' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getTypeIcon(selectedReport.type)}
                  </div>
                  <span className="text-neutral-900 capitalize">{selectedReport.type}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Titre</label>
                <p className="mt-1 text-neutral-900">{selectedReport.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <p className="mt-1 text-neutral-900">{selectedReport.description || selectedReport.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Signalé par</label>
                <p className="mt-1 text-neutral-900">{selectedReport.reportedBy}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Date du signalement</label>
                <p className="mt-1 text-neutral-900">
                  {new Date(selectedReport.reportDate).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">ID du contenu</label>
                <p className="mt-1 text-neutral-900 font-mono text-sm">{selectedReport.contentId}</p>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedReport.severity)}`}>
                      Priorité {selectedReport.severity}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    onClick={() => {
                      console.log('View content:', selectedReport.contentId);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le contenu
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => {
                      console.log('Ban content:', selectedReport.id);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    Bannir
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={() => {
                      console.log('Resolve report:', selectedReport.id);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    Résoudre
                  </button>
                  <button
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200"
                    onClick={() => setIsDetailsModalOpen(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModerationPage;