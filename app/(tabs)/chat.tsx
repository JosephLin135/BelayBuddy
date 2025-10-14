import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_PROJECT_URL environment variable');
}
if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_API_KEY environment variable');
}

const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

export default function ChatScreen() {
  const [posts, setPosts] = useState<{ id: string, user: string, title: string, content: string }[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // Optionally, subscribe to new posts in real-time:
    // const subscription = supabase
    //   .channel('public:posts')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
    //   .subscribe();
    // return () => { subscription.unsubscribe(); };
  }, []);

  // Add a new post to Supabase
  const handleAddPost = async () => {
    if (title.trim() && content.trim()) {
      const { error } = await supabase
        .from('posts')
        .insert([{ user: 'You', title: title.trim(), content: content.trim() }]);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setTitle('');
        setContent('');
        fetchPosts();
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f6f2' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { marginTop: 24 }]}>
          <Text style={styles.headerText}>BoulderTalk</Text>
          <Text style={styles.subHeader}>Community discussion for climbers</Text>
        </View>
        {/* Post input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title (e.g. 'Best crimp training tips?')"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.postButton} onPress={handleAddPost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
        {/* Posts list */}
        {loading ? (
          <ActivityIndicator style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent}>{item.content}</Text>
                <Text style={styles.postUser}>Posted by {item.user}</Text>
              </View>
            )}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: '#47526a',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8f6f2',
  },
  subHeader: {
    fontSize: 14,
    color: '#f8f6f2',
    marginTop: 2,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    backgroundColor: '#f8f6f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#47526a',
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    color: '#222',
  },
  postButton: {
    backgroundColor: '#47526a',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#f8f6f2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#47526a',
    marginBottom: 4,
  },
  postContent: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  postUser: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});