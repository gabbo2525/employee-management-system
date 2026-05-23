import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000'; 

export default function App() {
  const [userId] = useState(1); 
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');

  const handleAttendance = async (type: 'time_in' | 'time_out') => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/attendance/log`, { userId, type });
      if (response.data.success) {
        Alert.alert('Success', `Successfully recorded your ${type.replace('_', ' ')} stamp!`);
      }
    } catch (error) {
      Alert.alert('Connection Failure', 'Could not reach your Antigravity backend server container.');
    }
  };

  const handleLeaveSubmit = async () => {
    if (!leaveType || !reason) {
      Alert.alert('Validation Check', 'Please fulfill all input parameters before sending.');
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/leave/submit`, {
        userId, leave_type: leaveType, reason, start_date: '2026-05-25', end_date: '2026-05-26'
      });
      if (response.data.success) {
        Alert.alert('Success', 'Your leave entry request is now awaiting review.');
        setLeaveType('');
        setReason('');
      }
    } catch (error) {
      Alert.alert('Error', 'Submission routing process encountered an unexpected issue.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Employee Workspace Portal</Text>
      
      {/* Attendance Module */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shift Attendance Tracker</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.btnIn]} onPress={() => handleAttendance('time_in')}>
            <Text style={styles.btnText}>Clock In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnOut]} onPress={() => handleAttendance('time_out')}>
            <Text style={styles.btnText}>Clock Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Leave Application Module */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Request Time-Off Form</Text>
        <TextInput style={styles.input} placeholder="Leave Type (e.g., Sick, Vacation)" value={leaveType} onChangeText={setLeaveType} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="State reason details here..." multiline numberOfLines={3} value={reason} onChangeText={setReason} />
        <TouchableOpacity style={styles.submitBtn} onPress={handleLeaveSubmit}>
          <Text style={styles.btnText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#374151' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnIn: { backgroundColor: '#10B981' },
  btnOut: { backgroundColor: '#EF4444' },
  submitBtn: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' }
});