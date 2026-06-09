export const mockProductDetails: Record<
  number,
  { productImage: string; detail: string }
> = {
  1: {
    productImage:
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop",
    detail:
      "콜롬비아 나리뇨 지역의 고산지대에서 재배된 워시드 프로세스 원두입니다. 밝은 산미와 플로럴한 향, 달콤한 과일 뉘앙스가 특징입니다.",
  },
  2: {
    productImage:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop",
    detail:
      "브라질 세하 두 카파라오 지역의 내추럴 프로세스 원두입니다. 초콜릿과 견과류의 부드러운 풍미, 낮은 산미가 균형 잡힌 커피입니다.",
  },
  3: {
    productImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop",
    detail:
      "에티오피아 게샤 빌리지의 게이샤 품종 원두입니다. 재스민과 베르가못의 향기로운 플로럴 노트, 복숭아와 살구의 과일향이 돋보입니다.",
  },
  4: {
    productImage:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop",
    detail:
      "자메이카 블루마운틴 No.1 등급 원두입니다. 부드럽고 균형 잡힌 바디감, 은은한 단맛과 깔끔한 뒷맛이 특징인 프리미엄 원두입니다.",
  },
};

export const mockProducts = {
  items: [
    {
      productId: 1,
      productName: "Colombia Nariño",
      productPrice: 18000,
      productImage:
        "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop",
    },
    {
      productId: 2,
      productName: "Brazil Serra do Caparaó",
      productPrice: 15000,
      productImage:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop",
    },
    {
      productId: 3,
      productName: "Ethiopia Gesha Village",
      productPrice: 32000,
      productImage:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop",
    },
    {
      productId: 4,
      productName: "Jamaica Blue Mountain No.1",
      productPrice: 48000,
      productImage:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop",
    },
  ],
};
