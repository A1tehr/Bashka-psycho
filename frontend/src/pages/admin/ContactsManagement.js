import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, User, Phone, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const headers = getAuthHeader();
      const response = await axios.get(`${API_URL}/api/contacts`, { headers });
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      toast.error('Ошибка загрузки контактов');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Контактные сообщения</h2>
          <p className="text-gray-600">Всего сообщений: {contacts.length}</p>
        </div>
        <button
          onClick={loadContacts}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Обновить</span>
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Mail className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет сообщений</h3>
          <p className="text-gray-600">Контактные сообщения появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{contact.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{contact.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:text-indigo-700">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${contact.phone}`} className="text-indigo-600 hover:text-indigo-700">
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{contact.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;
