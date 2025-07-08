import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flash } from '@/types/flash';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface FlashCardProps {
  flash: Flash;
  priority?: boolean; // 是否為優先載入（首屏）
}

export function FlashCard({ flash, priority = false }: FlashCardProps) {
  // 直接使用 STRAPI 的 published_datetime 欄位
  const timeAgo = formatDistanceToNow(new Date(flash.published_datetime), {
    addSuffix: true,
    locale: zhCN, // 使用中文語言包
  });

  // 直接使用 STRAPI 的 view_count 欄位
  const viewCount = flash.view_count || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
      <Link href={`/flash/${flash.slug}`} className="block">
        <CardHeader className="space-y-3">
          {/* 分類標籤 */}
          <div className="flex flex-wrap gap-2">
            {flash.categories.map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>

          {/* 標題 */}
          <h2 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {flash.title}
          </h2>

          {/* 元資訊 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{flash.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
            {viewCount > 0 && (
              <span className="text-xs">
                {viewCount.toLocaleString()} 次瀏覽
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 特色圖片 */}
          {flash.featured_image && (
            <div className="relative aspect-video rounded-md overflow-hidden">
              <Image
                src={flash.featured_image.url}
                alt={flash.featured_image.alt || flash.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={priority}
              />
            </div>
          )}

          {/* 摘要 */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">
            {flash.content.slice(0, 150)}
            {flash.content.length > 150 && '...'}
          </p>

          {/* 標籤 */}
          {flash.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <Tag className="w-3 h-3 text-muted-foreground mr-1" />
              {flash.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {flash.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{flash.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 閱讀時間 */}
          {flash.meta?.reading_time && (
            <div className="text-xs text-muted-foreground">
              預計閱讀時間：{flash.meta.reading_time} 分鐘
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
} 