import React, { useState } from 'react';
import { Flag, CheckCircle, XCircle, MessageCircle, AlertTriangle } from 'lucide-react';

interface Report {
  id: string;
  type: 'book' | 'review' | 'user';
  title: string;
  reportedBy: string;
  reportDate: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
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
    severity: 'high'
  },
  {
    id: '2',
    type: 'review',
    title: 'Spam Review',
    reportedBy: 'jane@example.com',
    reportDate: '2024-03-14T15:45:00',
    reason: 'Multiple identical reviews from the same user',
    status: 'resolved',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'user',
    title: 'Harassment Report',
    reportedBy: 'mike@example.com',
    reportDate: '2024-03-13T09:20:00',
    reason: 'User sending inappropriate messages',
    status: 'pending',
    severity: 'high'
  }
];

const ContentModerationPage: React.FC = () => {
  const [reports] = useState<Report[]>(DUMMY_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">12</h3>
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
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">5</h3>
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
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">3</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Reports</h2>
        </div>

        <div className="divide-y divide-neutral-200">
          {reports.map((report) => (
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
                    <p className="text-sm text-neutral-600 mt-1">{report.reason}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-neutral-500">
                        Reported by: {report.reportedBy}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(report.reportDate).toLocaleDateString()}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Details Modal */}
      {isDetailsModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-neutral-900">Report Details</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Type</label>
                <p className="mt-1 text-neutral-900">{selectedReport.type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Title</label>
                <p className="mt-1 text-neutral-900">{selectedReport.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Reason</label>
                <p className="mt-1 text-neutral-900">{selectedReport.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Reported By</label>
                <p className="mt-1 text-neutral-900">{selectedReport.reportedBy}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Report Date</label>
                <p className="mt-1 text-neutral-900">
                  {new Date(selectedReport.reportDate).toLocaleString()}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => {
                      console.log('Take action:', selectedReport.id);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    Take Action
                  </button>
                  <button
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200"
                    onClick={() => {
                      console.log('Dismiss report:', selectedReport.id);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    Dismiss
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