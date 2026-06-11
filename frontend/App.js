import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { ErrorBoundary } from './src/components';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserListScreen from './src/screens/UserListScreen';
import UserDetailScreen from './src/screens/UserDetailScreen';
import ProjectListScreen from './src/screens/ProjectListScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import MyProjectsScreen from './src/screens/MyProjectsScreen';
import MyProposalsScreen from './src/screens/MyProposalsScreen';
import CreateProposalScreen from './src/screens/CreateProposalScreen';
import ProjectProposalsScreen from './src/screens/ProjectProposalsScreen';
import ProposalDetailScreen from './src/screens/ProposalDetailScreen';
import PhotoGalleryScreen from './src/screens/PhotoGalleryScreen';
import UploadPhotoScreen from './src/screens/UploadPhotoScreen';
import PhotoDetailScreen from './src/screens/PhotoDetailScreen';
import PublicPhotoFeedScreen from './src/screens/PublicPhotoFeedScreen';
import ConversationListScreen from './src/screens/ConversationListScreen';
import ChatScreen from './src/screens/ChatScreen';
import AdvancedSearchScreen from './src/screens/AdvancedSearchScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <AppProvider>
          <AuthProvider>
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#007AFF',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              >
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{ title: '🏠 Ana Sayfa' }}
                />
                <Stack.Screen 
                  name="Login" 
                  component={LoginScreen} 
                  options={{ title: '🔐 Giriş Yap' }}
                />
                <Stack.Screen 
                  name="Register" 
                  component={RegisterScreen} 
                  options={{ title: '📝 Kayıt Ol' }}
                />
                <Stack.Screen 
                  name="Profile" 
                  component={ProfileScreen} 
                  options={{ title: '👤 Profil' }}
                />
                <Stack.Screen 
                  name="UserList" 
                  component={UserListScreen} 
                  options={{ title: '👥 Kullanıcılar' }}
                />
                <Stack.Screen 
                  name="UserDetail" 
                  component={UserDetailScreen} 
                  options={{ title: '👤 Kullanıcı Detayı' }}
                />
                <Stack.Screen 
                  name="ProjectList" 
                  component={ProjectListScreen} 
                  options={{ title: '💼 İş İlanları' }}
                />
                <Stack.Screen 
                  name="ProjectDetail" 
                  component={ProjectDetailScreen} 
                  options={{ title: '📋 İlan Detayı' }}
                />
                <Stack.Screen 
                  name="CreateProject" 
                  component={CreateProjectScreen} 
                  options={{ title: '➕ İş İlanı Oluştur' }}
                />
                <Stack.Screen 
                  name="MyProjects" 
                  component={MyProjectsScreen} 
                  options={{ title: '💼 Projelerim' }}
                />
                <Stack.Screen 
                  name="MyProposals" 
                  component={MyProposalsScreen} 
                  options={{ title: '📝 Tekliflerim' }}
                />
                <Stack.Screen 
                  name="CreateProposal" 
                  component={CreateProposalScreen} 
                  options={{ title: '📝 Teklif Ver' }}
                />
                <Stack.Screen 
                  name="ProjectProposals" 
                  component={ProjectProposalsScreen} 
                  options={{ title: '📝 Proje Teklifleri' }}
                />
                <Stack.Screen 
                  name="ProposalDetail" 
                  component={ProposalDetailScreen} 
                  options={{ title: '📝 Teklif Detayı' }}
                />
                <Stack.Screen 
                  name="PublicPhotoFeed" 
                  component={PublicPhotoFeedScreen} 
                  options={{ title: '🌟 Keşfet' }}
                />
                <Stack.Screen 
                  name="PhotoGallery" 
                  component={PhotoGalleryScreen} 
                  options={{ title: '📸 Foto Galerim' }}
                />
                <Stack.Screen 
                  name="UploadPhoto" 
                  component={UploadPhotoScreen} 
                  options={{ title: '➕ Fotoğraf Yükle' }}
                />
                <Stack.Screen 
                  name="PhotoDetail" 
                  component={PhotoDetailScreen} 
                  options={{ title: '📸 Fotoğraf Detayı' }}
                />
                <Stack.Screen 
                  name="ConversationList" 
                  component={ConversationListScreen} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="Chat" 
                  component={ChatScreen} 
                  options={{ title: '💬 Mesajlar' }}
                />
                <Stack.Screen 
                  name="AdvancedSearch" 
                  component={AdvancedSearchScreen} 
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </AppProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
}
