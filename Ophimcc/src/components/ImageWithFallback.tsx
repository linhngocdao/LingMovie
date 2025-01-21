import { ReactElement } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ImageWithFallbackProps<T extends object = object> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  threshold?: number;
  effect?: 'blur' | 'opacity' | 'black-and-white';
  props?: T;
  placeholder?: ReactElement;
}

type ImageErrorEvent = React.SyntheticEvent<HTMLImageElement, Event>;

const ImageWithFallback = <T extends object = object>({
  src,
  alt,
  className,
  wrapperClassName,
  threshold = 100,
  effect = 'blur',
  props,
  placeholder,
}: ImageWithFallbackProps<T>): JSX.Element => {
  const fallbackImage = "https://placehold.co/300x400/png";

  const handleImageError = (e: ImageErrorEvent): void => {
    const imgElement = e.currentTarget;
    if (imgElement.src !== fallbackImage) {
      imgElement.src = fallbackImage;
    }
  };

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect={effect}
      className={className}
      wrapperClassName={wrapperClassName}
      onError={handleImageError}
      threshold={threshold}
      placeholder={placeholder}
      {...props}
    />
  );
};
export default ImageWithFallback;
