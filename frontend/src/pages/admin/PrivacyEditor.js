import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Save, Shield } from 'lucide-react';
import { toast } from 'sonner';

const PrivacyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings`);
      const htmlContent = response.data.privacy_policy || '';
      
      // Convert HTML to Draft.js content
      const contentBlock = htmlToDraft(htmlContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    } catch (error) {
      console.error('Failed to load privacy policy:', error);
      toast.error('Ошибка загрузки политики');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const headers = getAuthHeader();
      
      // Convert Draft.js content to HTML
      const contentState = editorState.getCurrentContent();
      const htmlContent = draftToHtml(convertToRaw(contentState));
      
      await axios.put(
        `${API_URL}/api/settings`,
        { privacy_policy: htmlContent },
        { headers }
      );
      toast.success('Политика конфиденциальности сохранена');
    } catch (error) {
      console.error('Failed to save privacy policy:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <span>Политика конфиденциальности</span>
        </h2>
        <p className="text-gray-600">Редактирование политики конфиденциальности сайта</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="border border-gray-300 rounded-lg min-h-96">
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class px-4 py-3 min-h-96"
              toolbarClassName="toolbar-class"
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                inline: {
                  options: ['bold', 'italic', 'underline', 'strikethrough'],
                },
                blockType: {
                  options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                },
                list: {
                  options: ['unordered', 'ordered'],
                },
              }}
              placeholder="Введите текст политики конфиденциальности..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyEditor;
