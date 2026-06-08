import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Deal, Comment, Shop, SHOPS } from '../constants/mockData';
import ShopSheet from './ShopSheet';

interface DealCardProps {
  deal: Deal;
  onLike: (id: number) => void;
}

function getBadgeStyle(badge: Deal['badge']) {
  switch (badge) {
    case 'mystery':
      return { backgroundColor: Colors.accent2 };
    case 'new':
      return { backgroundColor: Colors.green };
    case 'deal':
    default:
      return { backgroundColor: Colors.accent };
  }
}

export default function DealCard({ deal, onLike }: DealCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(deal.comments);
  const [commentInput, setCommentInput] = useState('');
  const [shopSheetVisible, setShopSheetVisible] = useState(false);

  const shopData: Shop | null = SHOPS[deal.storeId] ?? null;

  const handleComment = () => {
    if (commentInput.trim().length === 0) return;
    const newComment: Comment = {
      user: 'nico_deals',
      color: Colors.accent,
      text: commentInput.trim(),
    };
    setLocalComments((prev) => [...prev, newComment]);
    setCommentInput('');
  };

  return (
    <>
      <View style={styles.card}>
        {/* Store row */}
        <View style={styles.storeRow}>
          <TouchableOpacity
            style={styles.storeLeft}
            onPress={() => setShopSheetVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{deal.icon}</Text>
            </View>
            <View>
              <Text style={styles.storeName}>{deal.store}</Text>
              <Text style={styles.location}>{deal.location}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.badge, getBadgeStyle(deal.badge)]}>
            <Text style={styles.badgeText}>{deal.badgeText}</Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.title}>{deal.title}</Text>
        <Text style={styles.desc}>{deal.desc}</Text>

        {/* Price row */}
        {deal.price !== null && (
          <View style={styles.priceRow}>
            <Text style={styles.price}>{deal.price}</Text>
            {deal.oldPrice !== null && (
              <Text style={styles.oldPrice}>{deal.oldPrice}</Text>
            )}
            {deal.discount !== null && (
              <View style={styles.discountPill}>
                <Text style={styles.discountText}>{deal.discount}</Text>
              </View>
            )}
          </View>
        )}

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onLike(deal.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={deal.liked ? 'heart' : 'heart-outline'}
              size={20}
              color={deal.liked ? Colors.accent : Colors.muted}
            />
            <Text style={[styles.actionText, deal.liked && styles.actionTextActive]}>
              {deal.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setCommentsOpen((o) => !o)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={18} color={Colors.muted} />
            <Text style={styles.actionText}>{localComments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={20} color={Colors.muted} />
          </TouchableOpacity>

          <View style={styles.posterRow}>
            <View style={[styles.posterDot, { backgroundColor: deal.posterColor }]} />
            <Text style={styles.posterName}>{deal.poster}</Text>
            <Text style={styles.timeText}>{deal.time}</Text>
          </View>
        </View>

        {/* Comments section */}
        {commentsOpen && (
          <View style={styles.commentsSection}>
            {localComments.map((c, i) => (
              <View key={i} style={styles.commentRow}>
                <View style={[styles.commentDot, { backgroundColor: c.color }]} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>{c.user}</Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Kommentar schreiben..."
                placeholderTextColor={Colors.muted}
                value={commentInput}
                onChangeText={setCommentInput}
                onSubmitEditing={handleComment}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={handleComment} activeOpacity={0.7}>
                <Ionicons name="send" size={18} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ShopSheet
        shop={shopData}
        visible={shopSheetVisible}
        onClose={() => setShopSheetVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.cardRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconText: {
    fontSize: 20,
  },
  storeName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  location: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 1,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  desc: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  price: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: '800',
  },
  oldPrice: {
    color: Colors.muted,
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: Colors.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: Colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  actionTextActive: {
    color: Colors.accent,
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 'auto',
  },
  posterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  posterName: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    color: Colors.muted,
    fontSize: 11,
    marginLeft: 4,
  },
  commentsSection: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    gap: 10,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  commentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
});
