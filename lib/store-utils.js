/** Map backend store document to frontend form shape */
export function storeToForm(store) {
  if (!store) {
    return {
      name: '',
      color: '#7c3aed',
      brandColor: '#7c3aed',
      reward: '',
      rewardDescription: '',
      stampGoal: 10,
      logo: null,
    };
  }

  return {
    name: store.name || '',
    color: store.brandColor || '#7c3aed',
    brandColor: store.brandColor || '#7c3aed',
    reward: store.rewardDescription || '',
    rewardDescription: store.rewardDescription || '',
    stampGoal: store.stampGoal ?? 10,
    logo: store.logo || null,
    subscriptionStatus: store.subscriptionStatus,
  };
}

/** Map frontend form to backend store settings payload */
export function formToStorePayload(form) {
  return {
    name: form.name ?? form.storeName,
    brandColor: form.brandColor ?? form.color,
    rewardDescription: form.rewardDescription ?? form.reward,
    stampGoal: Number(form.stampGoal),
  };
}
