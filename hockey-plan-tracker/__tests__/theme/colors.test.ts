import { Colors } from '../../theme/colors';

describe('Colors', () => {
  it('exports background color', () => {
    expect(Colors.background).toBe('#0A0E1A');
  });
  it('exports accent color', () => {
    expect(Colors.accent).toBe('#4DD9E0');
  });
  it('has all required keys', () => {
    const required = ['background', 'surface', 'accent', 'snow', 'electric', 'amber', 'text', 'textMuted'];
    required.forEach(key => expect(Colors).toHaveProperty(key));
  });
});
