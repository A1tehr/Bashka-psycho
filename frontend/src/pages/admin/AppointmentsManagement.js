import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, User, Phone, Mail, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const headers = getAuthHeader();
      const response = await axios.get(`${API_URL}/api/appointments`, { headers });
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Ошибка загрузки записей');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const headers = getAuthHeader();
      await axios.put(
        `${API_URL}/api/appointments/${id}/status`,
        { status },
        { headers }
      );
      toast.success('Статус обновлен');
      loadAppointments();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    const labels = {
      pending: 'Ожидает',
      confirmed: 'Подтверждена',
      completed: 'Завершена',
      cancelled: 'Отменена',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Записи на консультации</h2>
          <p className="text-gray-600">Всего записей: {appointments.length}</p>
        </div>
        <button
          onClick={loadAppointments}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Обновить</span>
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет записей</h3>
          <p className="text-gray-600">Записи на консультации появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{appointment.client_name}</span>
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{appointment.client_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{appointment.client_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(appointment.preferred_date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{appointment.preferred_time}</span>
                    </div>
                  </div>

                  {appointment.child_name && (
                    <div className="text-sm text-gray-600">
                      <strong>Ребенок:</strong> {appointment.child_name}
                      {appointment.child_age && `, ${appointment.child_age} лет`}
                    </div>
                  )}

                  {appointment.message && (
                    <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                      <strong>Комментарий:</strong> {appointment.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-row lg:flex-col gap-2">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(appointment.id, 'confirmed')}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Подтвердить</span>
                      </button>
                      <button
                        onClick={() => updateStatus(appointment.id, 'cancelled')}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Отменить</span>
                      </button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(appointment.id, 'completed')}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Завершить</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsManagement;
